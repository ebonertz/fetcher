const Filter = require('bad-words');
const filter = new Filter();
const client = require('@commercetools/sdk-client');
const authMiddleware = require('@commercetools/sdk-middleware-auth');
const httpMiddleware = require('@commercetools/sdk-middleware-http');
const queueMiddleware = require('@commercetools/sdk-middleware-queue');
const fetch = require('node-fetch');

const projectKey = process.env.projectKey;

const sdkClient = client.createClient({
  middlewares: [authMiddleware.createAuthMiddlewareForClientCredentialsFlow({
    host: 'https://auth.commercetools.co',
    projectKey,
    credentials: {
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
    },
    fetch
  }), httpMiddleware.createHttpMiddleware({
    host: 'https://api.commercetools.co',
    fetch,
  }), queueMiddleware.createQueueMiddleware({
    concurrency: 5,
  })],
})

const receiveEvent = (event, context) => {
  const message = event.data;
  console.log('A new Review was created');
  const decodedMessage = Buffer.from(message, 'base64').toString()
  console.log(decodedMessage);
  return JSON.parse(decodedMessage);
};

const updateReviewState = (id, version) => {
  const reviewUri = `/${projectKey}/reviews/${id}`
  const body = {
    version,
    actions: [
      {action: 'transitionState',
        state:{
          id:'8fe7ca16-1189-41b9-b2e5-acb4708d8584',
          typeId:'state'
        }
      }
    ]
  }
  const updateStateRequest = {
    uri: reviewUri,
    method: 'POST',
    body
  }
  return sdkClient.execute(updateStateRequest);
}

const checkProfanity = (message) => {
  const isProfane  = filter.isProfane(message.review.text) || filter.isProfane(message.review.title)
  console.log(`Contains Profanity: ${isProfane}`);
  return isProfane;
}

exports.moderateReview = (event, context) => {
  const message = receiveEvent(event, context)
  const profanity = checkProfanity(message)
  if (profanity){
    updateReviewState(message.review.id,message.review.version)
  }
}
