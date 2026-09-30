import Axios from "../../../lib/core/Axios.js";
import assert from "assert";

describe('Axios', function () {
  describe('getUri', function () {
    it('should use a function paramsSerializer', function () {
      const axios = new Axios({});

      assert.strictEqual(axios.getUri({
        url: '/search',
        params: {q: 'hello'},
        paramsSerializer: () => 'custom=yes'
      }), '/search?custom=yes');
    });

    it('should support instances without a configuration', function () {
      const axios = new Axios();

      assert.strictEqual(axios.getUri({url: '/ping'}), '/ping');
    });

    it('should preserve configured defaults and object serializers', function () {
      const axios = new Axios({baseURL: 'https://api.example.com', params: {token: 'abc'}});

      assert.strictEqual(axios.getUri({
        url: '/search',
        params: {q: 'hello'}
      }), 'https://api.example.com/search?token=abc&q=hello');

      const customSerializerAxios = new Axios({
        paramsSerializer: {
          serialize: () => 'custom=yes'
        }
      });

      assert.strictEqual(customSerializerAxios.getUri({url: '/search', params: {q: 'hello'}}), '/search?custom=yes');
    });
  });

  describe("handle un-writable error stack", function () {
    async function testUnwritableErrorStack(stackAttributes) {
      const axios = new Axios({});
      // mock axios._request to return an Error with an un-writable stack property
      axios._request = () => {
        const mockError = new Error("test-error");
        Object.defineProperty(mockError, "stack", stackAttributes);
        throw mockError;
      }
      try {
        await axios.request("test-url", {})
      } catch (e) {
        assert.strictEqual(e.message, "test-error")
      }
    }

    it('should support errors with a defined but un-writable stack', async function () {
      await testUnwritableErrorStack({value: {}, writable: false})
    });

    it('should support errors with an undefined and un-writable stack', async function () {
      await testUnwritableErrorStack({value: undefined, writable: false})
    });

    it('should support errors with a custom getter/setter for the stack property', async function () {
      await testUnwritableErrorStack({
        get: () => ({}),
        set: () => {
          throw new Error('read-only');
        }
      })
    });

    it('should support errors with a custom getter/setter for the stack property (null case)', async function () {
      await testUnwritableErrorStack({
        get: () => null,
        set: () => {
          throw new Error('read-only');
        }
      })
    });
  })
});
