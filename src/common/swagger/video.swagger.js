import { format } from "mysql2";

const video = {
  "/video/video-list": {
    get: {
      tags: ["Videos"],
      security: [
        {
          tuanTranToken: [],
        },
      ],
      parameters: [
        {
          name: "page",
          in: "query",
          description: "nếu không truyền là 1",
        },
        {
          name: "pageSize",
          in: "query",
          description: "nếu không truyền là 10",
        },
      ],
      responses: {
        200: {
          description: `video`,
        },
      },
    },
  },
  "/video/video-detail/{id}": {
    get: {
      tags: ["Videos"],
      security: [{ tuanTranToken: [] }],

      responses: {
        200: {
          description: `oke`,
        },
      },
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID của video",
          required: true,
          schema: {
            type: "tring",
          },
        },
      ],
    },
  },
  "/video/video-create": {
    post: {
      tags: ["Videos"],
      security: [{ tuanTranToken: [] }],
      responses: {
        200: {
          description: `oke`,
        },
      },
      requestBody: {
        description: "dữ liệu để tạo 1 video",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                video_name: { type: "string" },
                desription: { type: "string" },
                views: { type: "number" },
              },
            },
          },
        },
      },
    },
  },
    // "/video/video-update": {
    //     post: {
    //        tags: ["Videos"],
    //        security: [{ tuanTranToken: [] }],
    //        responses: {
    //           200: {
    //              description: `oke`,
    //           },
    //        },
    //        requestBody: {
    //           description: "dữ liệu để tạo 1 video",
    //           content: {
    //              "multipart/form-data": {
    //                   schema: {
    //                       type: "object",
    //                   },
    //                   properties: {
    //                       file: {
    //                           type: "string" ,
    //                           format: "binary",

    //                       },

    //                    },
    //              }
    //           },
    //        },
    //     },
    //  },
  "/video/video-update": {
    post: {
      tags: ["Videos"],
      security: [{ tuanTranToken: [] }],
      responses: {
        200: {
          description: `oke`,
        },
      },
      requestBody: {
        description: "dữ liệu để tạo 1 video",
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                file: {
                  type: "string",
                  format: "binary",
                },
                files: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default video;
