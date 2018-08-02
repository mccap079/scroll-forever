# a prototype for procrastination

[demo](http://blog.p-am.cc/assets/a-prototype-for-procrastination/20180306_liveWeb_final_documentation.mov)

## overview

An ElectronJS app pulling viral media from imgur, youtube and giphy (+ a layer of emojis) and displaying them in an obnoxiously hypnotizing infinite scrolling feed that overlays your current desktop (in a transparent window.) Scroll forever <3

## how to run:

Download the `.app` (macOS) [here](https://github.com/mccap079/scroll-forever/blob/master/app/Procrastination-Feed-darwin-x64.zip) or at `app > Procrastination Feed-darwin-x64 > Procrastination Feed.app`.

## if you were to host this yourself:

 - socket.io required to run the site (that the app displays).
 - SSL certs omitted from this repo. You need to create a `my-cert.pem` and a `my-key.pem` and place them in the `server` directory. HTTPS is necessary to interact with the various APIs.
