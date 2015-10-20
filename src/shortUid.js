export default function shortUid() {
  // http://stackoverflow.com/a/6248722/20003
  return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
}
