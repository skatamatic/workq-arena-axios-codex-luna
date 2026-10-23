# parseProtocol documentation acceptance

This note describes the existing `lib/helpers/parseProtocol.js` helper and
the unchanged examples in `test/unit/helpers/parseProtocol.js`. It introduces
no runtime behavior changes.

`parseProtocol(url)` extracts a protocol token from the start of its input.
The regular expression accepts 1–25 characters drawn from ASCII word
characters (letters, digits, and underscore), plus `+` and `-`. The token must
be followed by `://`, `//`, or `:`. The helper returns the captured token,
preserving its spelling and case, or an empty string when no match exists.
It does not validate a complete URL or decide whether a protocol is supported.

The existing focused test covers these examples:

| Input | Result |
| --- | --- |
| `http://username:password@example.com/` | `http` |
| `ftp:google.com` | `ftp` |
| `sms:+15105550101?body=hello%20there` | `sms` |
| `tel:0123456789` | `tel` |
| `//google.com` | empty string |
| `google.com` | empty string |
| `admin://etc/default/grub` | `admin` |
| `stratum+tcp://server:port` | `stratum+tcp` |
| `/api/resource:customVerb` | empty string |
| `https://stackoverflow.com/questions/` | `https` |
| `mailto:jsmith@example.com` | `mailto` |
| `chrome-extension://1234/<pageName>.html` | `chrome-extension` |

The leading anchor means a colon later in a relative path does not turn that
path into a protocol. The length and character rules above describe the
implementation; the focused test does not exercise every boundary of those
rules.

The acceptance check installs locked dependencies with normal npm lifecycle
hooks and runs the existing focused spec:

```sh
npm ci && /usr/local/bin/node node_modules/mocha/bin/mocha.js test/unit/helpers/parseProtocol.js --timeout 30000 --exit
```

This is focused documentation acceptance, not full Axios, browser, or customer
coverage.
