export enum ErrorMessageCode {
  BAD_REQUEST = '400001',
  // 權限驗證信息缺失或不合法
  UNAUTHORIZED = '401001',
  // 權限不匹配
  FORBIDDEN = '403001',
  // SERVER 端無法定位資源
  NOT_FOUND = '404001',
  // 上傳檔案容量過大
  PAYLOAD_TOO_LARGE = '413001',
  // SERVER 端內部錯誤
  SERVER_ERROR = '500001',
}
