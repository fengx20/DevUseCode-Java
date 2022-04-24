const {Button} = antd;
const {WeaDialog} = ecCom;

class NewReqTopButtonCom extends React.Component {
    constructor(props) { //初始化，固定语法
        super(props);
        this.state = {
            title: "企业查询",
            visible: false,
            url: "",
            khqcValue: ""
        };
    }
    componentDidMount() {
        ecodeSDK.setCom('${appId}','NewReqTopButtonComInstance',this);
    }
    componentWillUnmount() {
        ecodeSDK.setCom('${appId}','NewReqTopButtonComInstance',null);
    }
    triggerModal(b,khqcValue,url) {
        this.setState({
            visible:b,
            khqcValue:khqcValue,
            url:url
        });
        console.log(khqcValue);
        console.log(url);
    }
    render() {
        let buttons = [
            <Button type="primary">搜索</Button>,
            <Button type="primary">重置</Button>,
            <Button type="ghost">取消</Button>
        ];
        const { title, visible, url } = this.state;
        //由于复写的位置放的是按钮，如果使用div可能会影响布局，所以建议使用span
        return (
            <WeaDialog
                title={title}
                visible={visible}
                maskClosable='true'
                url={url}
                style={{width: 1500, height: 1000}}
                onCancel={() => this.setState({ visible: false, khqcValue: '' })}
            />
        )
    }
}

// buttons={buttons}
//         bottomLeft="这是左侧添加的额外内容"
//         onCancel={() => this.setState({ visible: false })}

//发布模块
ecodeSDK.setCom('${appId}','NewReqTopButtonCom',NewReqTopButtonCom);

















// const {Button, Modal} = antd;
// const {WeaDialog, WeaTools} = ecCom;
// const { observer, inject } = mobxReact;

// class EnterpriseInquiry extends React.Component {
//   constructor(props) { //初始化，固定语法
//     super(props);
//     // this.state = {
//     //   title: "触发弹窗",
//     //   visible: false
//     // };
//   }
//   componentDidMount() {
//     ecodeSDK.setCom('${appId}','EnterpriseInquiry',this);
//   }
//   componentWillUnmount() {
//     ecodeSDK.setCom('${appId}','EnterpriseInquiry',null);
//   }
//   // triggerModal(b) {
//   //   this.setState({
//   //     visible:b
//   //   });
//   // }
//   // showConfirm() {
//   //   Modal.confirm({
//   //     title: "关账确认",
//   //     content: "是否确认关账跳转到下一考勤周期？",
//   //     onOk() {
//   //       ecCom.WeaTools.callApi('/api/closedata/sysclose', 'GET').then(
//   //         function(data){
//   //           if(data.result == "success"){
//   //             const modal = Modal.success({
//   //               title: '关账确认',
//   //               content: '已成功关账',
//   //             });
//   //             setTimeout(() => modal.destroy(), 2000);
//   //           }
//   //           // console.log(data.result);
//   //         }
//   //       )
//   //     },
//   //     onCancel() {
//   //       console.log("关账取消");
//   //     }
//   //   });
//   // }
//   render() {
//     let buttons = [
//       <Button type="primary" onClick={() => this.setState({ visible: false })}>
//         确定
//       </Button>,
//       <Button type="ghost" onClick={() => this.setState({ visible: false })}>
//         取消
//       </Button>
//     ];
//     //const { title, visible } = this.state;
//     return (
//       ""
//     );
//   }
// }

// //发布模块
// ecodeSDK.setCom('${appId}','Closedata',Closedata);
