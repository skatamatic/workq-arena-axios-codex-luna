import Axios from "../../../lib/core/Axios.js";
import axios from "../../../lib/axios.js";
import assert from "assert";

describe('Axios', function () {
  describe('getUri', function () {
    it('should use a function paramsSerializer', function () {
      assert.strictEqual(axios.getUri({
        url: '/search',
        params: {q: 'hello'},
        paramsSerializer: () => 'custom=yes'
      }), '/search?custom=yes');
    });

    it('should work when Axios is constructed without a config', function () {
      assert.strictEqual(new Axios().getUri({url: '/ping'}), '/ping');
    });

    it('should preserve constructor defaults and object paramsSerializer', function () {
      const instance = new Axios({
        baseURL: 'https://api.example.com',
        params: {token: 'default'},
        paramsSerializer: {
          serialize: params => `custom=${params.token}`
        }
      });

      assert.strictEqual(instance.getUri({url: '/ping'}), 'https://api.example.com/ping?custom=default');
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
