# Mobile verification for NodeBB using Twilio

More of a proof-of-concept than a full fledged plugin, but it works! If anybody wants to continue from here, let me know and I'll make you the maintainer :)

Create an account on [Twilio](http://twilio.com). On your user profile page find your Account SID and Auth Token - put this information in the Twilio ACP (yournodebb.com/admin/twilio). Enter the "from" number as well, which should be an associated personal mobile number on Twilio, or one that they create for you.

Don't forget to check "require email confirmation" in ACP -> Settings -> User. If this plugin is enabled no email confirmations will go out at all.

Would be nice to give the user a choice between email and mobile verification but as I said in the first sentence it's more of a proof-of-concept! :)

Basic text messaging is free (but the texts will say "Sent from your trial account").

## Installation

    npm install nodebb-plugin-twilio