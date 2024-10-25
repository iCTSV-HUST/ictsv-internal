/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const snapshot = [
    {
      "id": "_pb_users_auth_",
      "created": "2024-10-25 14:40:06.931Z",
      "updated": "2024-10-25 14:41:51.433Z",
      "name": "members",
      "type": "auth",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "users_name",
          "name": "name",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "h2s4et5b",
          "name": "usercode",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "2x1znkyy",
          "name": "department",
          "type": "relation",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "qwh14n0jp5ge2mp",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 2,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "bgamqjkn",
          "name": "role",
          "type": "relation",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "ssojx7sf908jscg",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "rzjs8rv3",
          "name": "active",
          "type": "bool",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "pdt1ddfe",
          "name": "generation",
          "type": "number",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": false
          }
        },
        {
          "system": false,
          "id": "users_avatar",
          "name": "avatar",
          "type": "file",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "mimeTypes": [
              "image/jpeg",
              "image/png",
              "image/svg+xml",
              "image/gif",
              "image/webp"
            ],
            "thumbs": null,
            "maxSelect": 1,
            "maxSize": 5242880,
            "protected": false
          }
        },
        {
          "system": false,
          "id": "lsh4yms9",
          "name": "sort_override",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": true
          }
        }
      ],
      "indexes": [],
      "listRule": "@request.auth.collectionName = \"members\"",
      "viewRule": "@request.auth.collectionName = \"members\"",
      "createRule": "@request.auth.department.name ?= \"Tiểu ban\" ||\n(@request.auth.role.codename = \"topho\" ||\n@request.auth.role.codename = \"totruong\")",
      "updateRule": "id = @request.auth.id",
      "deleteRule": null,
      "options": {
        "allowEmailAuth": true,
        "allowOAuth2Auth": true,
        "allowUsernameAuth": true,
        "exceptEmailDomains": null,
        "manageRule": null,
        "minPasswordLength": 8,
        "onlyEmailDomains": [
          "sis.hust.edu.vn"
        ],
        "onlyVerified": false,
        "requireEmail": false
      }
    },
    {
      "id": "3ta42cbzdiggo12",
      "created": "2024-10-25 14:41:51.433Z",
      "updated": "2024-10-25 14:41:51.433Z",
      "name": "attendances",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "racztrg9",
          "name": "date",
          "type": "date",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": "",
            "max": ""
          }
        },
        {
          "system": false,
          "id": "rrhscnp2",
          "name": "members",
          "type": "relation",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": true,
            "minSelect": null,
            "maxSelect": null,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "mo6yhmi4",
          "name": "locked",
          "type": "bool",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {}
        }
      ],
      "indexes": [
        "CREATE UNIQUE INDEX `idx_uKNnIVC` ON `attendances` (\n  `members`,\n  `date`\n)"
      ],
      "listRule": "@request.auth.collectionName = \"members\"",
      "viewRule": "@request.auth.collectionName = \"members\"",
      "createRule": "@request.auth.department.name ?= \"Tiểu ban\" ||\n(@request.auth.role.codename = \"topho\" ||\n@request.auth.role.codename = \"totruong\")",
      "updateRule": "locked = false && (\n@request.auth.department.name ?= \"Tiểu ban\" ||\n(@request.auth.role.codename = \"topho\" ||\n@request.auth.role.codename = \"totruong\") )",
      "deleteRule": "locked = false && (\n@request.auth.department.name ?= \"Tiểu ban\" ||\n(@request.auth.role.codename = \"topho\" ||\n@request.auth.role.codename = \"totruong\") )",
      "options": {}
    },
    {
      "id": "qwh14n0jp5ge2mp",
      "created": "2024-10-25 14:41:51.433Z",
      "updated": "2024-10-25 14:41:51.433Z",
      "name": "departments",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "zzqp5ubj",
          "name": "name",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        }
      ],
      "indexes": [],
      "listRule": "@request.auth.collectionName = \"members\"",
      "viewRule": "@request.auth.collectionName = \"members\"",
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "gjneaki9arsrfqv",
      "created": "2024-10-25 14:41:51.433Z",
      "updated": "2024-10-25 14:41:51.433Z",
      "name": "jsonstorage",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "laomcibb",
          "name": "data",
          "type": "json",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "maxSize": 2000000
          }
        }
      ],
      "indexes": [],
      "listRule": null,
      "viewRule": "",
      "createRule": null,
      "updateRule": "@request.auth.usercode = \"20226809\"",
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "ssojx7sf908jscg",
      "created": "2024-10-25 14:41:51.433Z",
      "updated": "2024-10-25 14:41:51.433Z",
      "name": "roles",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "tp63ogqy",
          "name": "codename",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "vdueykq9",
          "name": "name",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "kkgzryj2",
          "name": "rank",
          "type": "number",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": false
          }
        }
      ],
      "indexes": [],
      "listRule": "@request.auth.collectionName = \"members\"",
      "viewRule": "@request.auth.collectionName = \"members\"",
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    }
  ];

  const collections = snapshot.map((item) => new Collection(item));

  return Dao(db).importCollections(collections, true, null);
}, (db) => {
  return null;
})
