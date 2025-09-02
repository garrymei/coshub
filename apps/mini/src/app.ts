import { Component } from "react";
import "./app.scss";

class App extends Component {
  componentDidMount() {
    console.log("🎌 Coshub Mini 小程序启动成功！");
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    // this.props.children 是将要会渲染的页面
    return this.props.children;
  }
}

export default App;
