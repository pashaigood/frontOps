import { WebpackOptions } from "factories/config";

export default (options: WebpackOptions) => {
  return (context, { merge }) => {
    return merge({
      entry: 'index.html'
    })
  }
}
