export const responseSuccess = (metadata = null,message = `OK`,code = 200) => { 
    if (typeof code !== `number`) {
        code = 200
    }
    const resData = {
        status: `success`,
        code: code,
        message:message,
        metaData: metadata,
        doc:`api.domain.com/doc`
    }
    return resData
 }

//  null có nhưng giá trị rỗng
// undefined là ko có luôn


//undefined sẽ được hiểu là ko truyền gì cả và sẽ được => là mặc định vd:code = 500
export const responseError = (message = `Internal Server Error`,code = 500, stack=null) => { 
    //thêm cái này để tránh trường hợp code là string gây crashed server
    if (typeof code !== `number`) {
        code = 500
    }
    return  {
        status: `error`,
        code: code,
        message:message,
        stack:stack
    }
 }
//  stack để xác định vị trí lỗi ở đâu