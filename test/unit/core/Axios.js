import Axios from "../../../lib/core/Axios.js";
import axios from "../../../lib/axios.js";
import assert from "assert";

describe('Axios', function () {
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

  it('should build a URI without constructor configuration', function () {
    const instance = new axios.Axios();

    assert.strictEqual(instance.getUri({url: '/ping'}), '/ping');
  });

  it('should preserve constructor defaults when building a URI', function () {
    const axios = new Axios({
      baseURL: 'https://example.com',
      params: {default: 'value'}
    });

    assert.strictEqual(axios.getUri({url: '/ping', params: {query: 'value'}}), 'https://example.com/ping?default=value&query=value');
  });

  it('should use a function paramsSerializer when building a URI', function () {
    assert.strictEqual(axios.getUri({
      url: '/search',
      params: {q: 'hello'},
      paramsSerializer: () => 'custom=yes'
    }), '/search?custom=yes');
  });

  it('should use an object paramsSerializer when building a URI', function () {
    assert.strictEqual(axios.getUri({
      url: '/search',
      params: {q: 'hello'},
      paramsSerializer: {
        serialize: () => 'object=yes'
      }
    }), '/search?object=yes');
  });
});
