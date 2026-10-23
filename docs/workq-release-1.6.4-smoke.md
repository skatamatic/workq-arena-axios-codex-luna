# Workq 1.6.4 credential smoke

This documentation-only acceptance checks personal-account PR publication against
`arena-baseline`. AutoMerge is off; this task does not authorize merging.

## Inspected behavior

`lib/helpers/parseProtocol.js` matches a protocol only at the start of its input.
The captured name contains 1–25 characters from ASCII word characters (letters,
digits and underscore), plus and hyphen. It accepts a colon, colon followed by
`//`, or `//` after that name, returns the captured name without normalization,
and returns an empty string when no match exists. It is a prefix extractor,
not a complete URL or standards-compliant scheme validator.

The existing `test/unit/helpers/parseProtocol.js` checks HTTP and HTTPS, FTP,
SMS, telephone, admin, stratum+tcp, mailto and chrome-extension examples. It
expects an empty string for a protocol-relative URL, a bare hostname and a
relative resource path containing a later colon. The helper and assertions
remain unchanged.

## Focused verification

Run the existing spec with the configured installed native ARM64 Node 22.17:

```sh
/usr/local/bin/node node_modules/mocha/bin/mocha.js test/unit/helpers/parseProtocol.js --timeout 30000 --exit
```

Actual command output is attached to the work item and PR as evidence. This is
focused docs-only acceptance, not full Axios coverage. No new tests or product
changes are included. The optional Loose backing-ticket lookup warning is
preserved on the item and skipped under the Captain’s recorded disposition;
required verification and ordinary publication hooks remain required.
