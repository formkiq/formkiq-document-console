# FormKiQ Document Console

<div align="center" style="margin: 30px;">
<a href="https://formkiq.com/">
  <img src="https://github.com/formkiq/formkiq-core/raw/master/images/logo.png" style="width:600px;" align="center" />
</a>
<br />
<br />

<div align="center">
    <a href="https://formkiq.com">Home Page</a> |
    <a href="https://docs.formkiq.com">Documentation</a> | 
    <a href="https://blog.formkiq.com">Blog</a> |
    <a href="https://github.com/formkiq/formkiq-core#Installation">Installation</a> |
    <a href="https://www.formkiq.com/pricing">Paid Support</a>
</div>
</div>

### How it works


This is a turn-key web interface for FormKiQ's Document Management System, built with [React](https://reactjs.org/).

NOTE: this project is set up as an Nx mono repository. All commands should be run from ./formkiq

**To set up and run for the first time locally:**

1. `run npm install`
2. retrieve and copy the response from your live FormKiQ Document Console, i.e., `https://{CLOUDFRONT_URI}.cloudfront.net/assets/config.json`
3. paste the response into a new file in the console: `/formkiq/apps/formkiq-document-console-react/src/assets/config.local.json`
4. run the console: `npx nx serve formkiq-document-console-react`

Your login should be the same as for the live console.

**To run tests:**

`nx test formkiq-document-console-react`