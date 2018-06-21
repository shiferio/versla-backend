define({ "api": [  {    "type": "get",    "url": "/api/accounts/profile",    "title": "Get user profile",    "name": "Get_Profile",    "group": "Accounts",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "token",            "optional": false,            "field": "User",            "description": "<p>token</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "user",            "description": "<p>User profile</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK\n    meta: {\n     \"success\": true,\n     \"code\": 200,\n     \"message\": \"Successfully get your profile\"\n    },\n    data: {\n     \"user\": {\n\t\t\t\"address\": {\n\t\t\t\t\"addr1\": \"Street 1\",\n\t\t\t\t\"addr2\": \"Street\",\n\t\t\t\t\"city\": \"Kirov\",\n\t\t\t\t\"country\": \"Russia\",\n\t\t\t\t\"postalCode\": \"610000\"\n\t\t\t},\n\t\t\t\"isSeller\": true,\n\t\t\t\"_id\": \"5b137f7e57d4fe093f5b51f3\",\n\t\t\t\"created\": \"2018-06-03T05:41:18.798Z\",\n\t\t\t\"login\": \"denis\",\n\t\t\t\"password\": \"$2a$10$/MsH1M3s/5GzRM2A60f0R.DXx7BhWPerNbMWPgqJtX76bm27EARji\",\n\t\t\t\"email\": \"dl@progears.ru\",\n\t\t\t\"picture\": \"http://images.versla.ru/files/7f847a561a88046a59989dc394e6efef91e8bb56bf43ed04a342b2f8ec16fbad.jpeg\",\n\t\t\t\"__v\": 0,\n\t\t\t\"first_name\": \"Denis\",\n\t\t\t\"last_name\": \"Lubyannikov\",\n\t\t\t\"phone\": \"9991008820\"\n\t\t}\n    }",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routes/account.js",    "groupTitle": "Accounts"  },  {    "type": "post",    "url": "/api/accounts/login",    "title": "User authorization",    "name": "Login",    "group": "Accounts",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": ""          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>Security token</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\nmeta: {\n \"success\": true,\n \"code\": 200,\n \"message\": \"You are successfully logined\"\n},\ndata: {\n \"token\": \"token\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routes/account.js",    "groupTitle": "Accounts"  },  {    "type": "post",    "url": "/api/accounts/signup",    "title": "User SignUp",    "name": "SignUp",    "group": "Accounts",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "login",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": ""          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "phone",            "description": ""          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>Security token</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\nmeta: {\n \"success\": true,\n \"code\": 200,\n \"message\": \"You are successfully logined\"\n},\ndata: {\n \"token\": \"token\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routes/account.js",    "groupTitle": "Accounts"  },  {    "type": "post",    "url": "/api/accounts/profile",    "title": "Update user profile",    "name": "Update_Profile",    "group": "Accounts",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "token",            "optional": false,            "field": "User",            "description": "<p>token</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "user",            "description": "<p>User profile</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK\n    meta: {\n     \"success\": true,\n     \"code\": 200,\n     \"message\": \"Successfully updated your profile\"\n    },\n    data: {\n     \"user\": {\n\t\t\t\"address\": {\n\t\t\t\t\"addr1\": \"Street 1\",\n\t\t\t\t\"addr2\": \"Street\",\n\t\t\t\t\"city\": \"Kirov\",\n\t\t\t\t\"country\": \"Russia\",\n\t\t\t\t\"postalCode\": \"610000\"\n\t\t\t},\n\t\t\t\"isSeller\": true,\n\t\t\t\"_id\": \"5b137f7e57d4fe093f5b51f3\",\n\t\t\t\"created\": \"2018-06-03T05:41:18.798Z\",\n\t\t\t\"login\": \"denis\",\n\t\t\t\"password\": \"$2a$10$/MsH1M3s/5GzRM2A60f0R.DXx7BhWPerNbMWPgqJtX76bm27EARji\",\n\t\t\t\"email\": \"dl@progears.ru\",\n\t\t\t\"picture\": \"http://images.versla.ru/files/7f847a561a88046a59989dc394e6efef91e8bb56bf43ed04a342b2f8ec16fbad.jpeg\",\n\t\t\t\"__v\": 0,\n\t\t\t\"first_name\": \"Denis\",\n\t\t\t\"last_name\": \"Lubyannikov\",\n\t\t\t\"phone\": \"9991008820\"\n\t\t}\n    }",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routes/account.js",    "groupTitle": "Accounts"  },  {    "type": "put",    "url": "/api/accounts/cart",    "title": "Update cart",    "name": "Update_cart",    "group": "Accounts",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "token",            "optional": false,            "field": "User",            "description": "<p>token</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "user",            "description": "<p>User profile</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "    HTTP/1.1 200 OK\n    meta: {\n     \"success\": true,\n     \"code\": 200,\n     \"message\": \"Successfully updated your profile\"\n    },\n    data: {\n     \"user\": {\n\t\t\t\"address\": {\n\t\t\t\t\"addr1\": \"Street 1\",\n\t\t\t\t\"addr2\": \"Street\",\n\t\t\t\t\"city\": \"Kirov\",\n\t\t\t\t\"country\": \"Russia\",\n\t\t\t\t\"postalCode\": \"610000\"\n\t\t\t},\n\t\t\t\"isSeller\": true,\n\t\t\t\"_id\": \"5b137f7e57d4fe093f5b51f3\",\n\t\t\t\"created\": \"2018-06-03T05:41:18.798Z\",\n\t\t\t\"login\": \"denis\",\n\t\t\t\"password\": \"$2a$10$/MsH1M3s/5GzRM2A60f0R.DXx7BhWPerNbMWPgqJtX76bm27EARji\",\n\t\t\t\"email\": \"dl@progears.ru\",\n\t\t\t\"picture\": \"http://images.versla.ru/files/7f847a561a88046a59989dc394e6efef91e8bb56bf43ed04a342b2f8ec16fbad.jpeg\",\n\t\t\t\"__v\": 0,\n\t\t\t\"first_name\": \"Denis\",\n\t\t\t\"last_name\": \"Lubyannikov\",\n\t\t\t\"phone\": \"9991008820\"\n\t\t}\n    }",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routes/account.js",    "groupTitle": "Accounts"  },  {    "type": "post",    "url": "/api/goods/add",    "title": "Add good",    "name": "Add_good",    "group": "Goods",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "store_id",            "description": "<p>Good store id</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Good name</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "price",            "description": "<p>Good price</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "picture",            "description": "<p>Good picture</p>"          },          {            "group": "Parameter",            "type": "Object",            "optional": false,            "field": "tags",            "description": "<p>Good tags</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "type",            "description": "<p>Good type</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "Good",            "description": ""          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\nmeta: {\n \"success\": true,\n \"code\": 200,\n \"message\": \"Good successfully added\"\n},\ndata: {\n \"goods\": good\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routes/goods.js",    "groupTitle": "Goods"  },  {    "type": "delete",    "url": "/api/goods/delete",    "title": "Delete good",    "name": "Delete_good",    "group": "Goods",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "good_id",            "description": "<p>Good store id</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "Good",            "description": ""          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\nmeta: {\n \"success\": true,\n \"code\": 200,\n \"message\": \"Good successfully deleted\"\n},\ndata: {\n \"good\": null\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routes/goods.js",    "groupTitle": "Goods"  },  {    "type": "get",    "url": "/api/goods/:id",    "title": "Get good info",    "name": "Get_good_info",    "group": "Goods",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "id",            "description": "<p>Id of Good</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "Good",            "description": ""          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\nmeta: {\n \"success\": true,\n \"code\": 200,\n \"message\": \"Successfully get good\"\n},\ndata: {\n \"goods\": good\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routes/goods.js",    "groupTitle": "Goods"  },  {    "type": "get",    "url": "/api/goods/list/:pageNumber/:pageSize",    "title": "List all goods",    "name": "List_Goods",    "group": "Goods",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "pageNumber",            "description": "<p>Page Number.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "pageSize",            "description": "<p>Page Size</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "goods",            "description": "<p>Array of goods</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\nmeta: {\n \"success\": true,\n \"code\": 200,\n \"message\": \"Successfully get goods\"\n},\ndata: {\n \"goods\": []\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routes/goods.js",    "groupTitle": "Goods"  }] });
