import myAxios from "../MyAxios.js";
import BASEURL from "../BaseUrl.js";

const AdminApi = {
  /**
   * 执行登录业务
   * @param {Object} params {username:xx,  password:xxx}
   */
  login(params) {
    return myAxios.post(BASEURL + "/user/login", params);
  },
};

export default AdminApi;
