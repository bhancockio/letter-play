const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.statsCreated = functions
	.firestore()
	.document("stats/{statsId}")
	.onCreate((snap, context) => {
		const stats = snap.data();
		const statsId = context.params.statsId;

		//
	});

// TODO: Update personal users stats

// TODO: Udate stats for specific word
