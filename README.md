# Thor

> A Kibana app for metrics
---

## development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following npm tasks.

<dl>
  <dt><code>gulp</code></dt>
  <dd>Build and sync code to the <code>kibana</code> directory (which should be a slibling)</dd>

  <dt><code>npm start</code></dt>
  <dd>Start kibana and have it include this plugin</dd>

  <dt><code>npm run build</code></dt>
  <dd>Build a distributable archive</dd>

  <dt><code>npm run test:browser</code></dt>
  <dd>Run the browser tests in a real web browser</dd>

  <dt><code>npm run test:server</code></dt>
  <dd>Run the server tests using mocha</dd>
</dl>

For more information about any of these commands run `npm run ${task} -- --help`.
