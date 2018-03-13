const express = require('express');
const app = express();
const process = require('process');

const jsonParser = require('body-parser').json;

const MongoClient = require('mongodb').MongoClient;

const ZSchema = require('z-schema');
const validator = new ZSchema();

const port = process.env.port || 7643;
const uri = process.env.uri || '/';

const mongoUri = 'mongodb://localhost:27017';
const db = 'local';
const collection = 'eventCapture';

const submissionSchema = {
  definitions: {
    event: {
      type: 'object',
      properties: {
        event: {
          type: 'string'
        },
        altKey: {
          type: 'boolean'
        },
        ctrlKey: {
          type: 'boolean'
        },
        shiftKey: {
          type: 'boolean'
        },
        metaKey: {
          type: 'boolean'
        },
        x: {
          type: 'number'
        },
        y: {
          type: 'number'
        },
        clientX: {
          type: 'number'
        },
        clientY: {
          type: 'number'
        },
        layerX: {
          type: 'number'
        },
        layerY: {
          type: 'number'
        },
        movementX: {
          type: 'number'
        },
        movementY: {
          type: 'number'
        },
        button: {
          type: 'number'
        },
        buttons: {
          type: 'number'
        },
        eventPhase: {
          type: 'number'
        },
        originalTarget: {
          type: 'string'
        },
        relatedTarget: {
          type: 'string'
        },
        target: {
          type: 'string'
        }
      },
      additionalProperties: false
    }
  },
  type: 'object',
  properties: {
    userAgent: {
      type: 'string'
    },
    uid: {
      type: 'string'
    },
    data: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [
            'deviceType',
            'load',
            'step'
          ]
        },
        message: {
          type: 'string'
        },
        step: {
          type: 'number'
        },
        stepTitle: {
          type: 'string'
        },
        event: {
          $ref: '#/definitions/event'
        },
        button: {
          type: 'string'
        },
        stepEvents: {
          type: 'array',
          items: {
            $ref: '#/definitions/event'
          }
        }
      },
      additionalProperties: false,
      required: [ 'type' ]
    },
    event: {
      $ref: '#/definitions/event'
    }
  },
  additionalProperties: false
};

app.use(jsonParser());
app.use(uri, express.static('./client'));

if (!validator.validateSchema(submissionSchema)) {
  console.error('Invalid schema', validator.getLastErrors());
  return 1;
}

app.post(uri, (req, res) => {
  // Validate data
  if (validator.validate(req.body, submissionSchema)) {
    const data = {
      ...req.body,
      date: new Date()
    };

    MongoClient.connect(mongoUri, (err, client) => {
      if (err) {
        console.error('Error connecting to database', err);
        res.status(500).type('json').end();
        return;
      }

      client.db(db).collection(collection).insert(data, (result) => {
        res.status(200).type('json').end();

        client.close();
      });
    });
  } else {
    console.error('Error handling submission', req.body, validator.getLastErrors());

    res.status(400).type('json').end();
  }
});

app.listen(port);
console.log('Listening on port', port, 'under', uri);
