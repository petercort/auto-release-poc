const axios = require('axios')

module.exports = async function waitForApproval(core) {
  const url = `${process.env.SNOW_URL}/api/sn_chg_rest/change/normal/${process.env.sys_id}`
  const username = process.env.SNOW_USERNAME
  const password = process.env.SNOW_PASSWORD
  const auth = {
    username: username,
    password: password
  }
  try {
    var response = await axios(url, { auth })
    console.log(response.data)
    while (response.data.result.state.value !== '3') {
      console.log(`Request state: ${response.data.result.state.display_value}`)
      await new Promise(r => setTimeout(r, 5000));
      response = await axios(url, { auth })
    }
    core.setOutput('state', response.data.result.state.approval_history.display_value);
  } catch (error) {
    core.setFailed(error.message);
  }
}
