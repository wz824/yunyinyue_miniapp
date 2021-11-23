// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
import PubSub, { publish } from 'pubsub-js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[],//推荐列表数据
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      WebGLRenderingContext.showToast({
        title:'请先登录',
        icon:'none',
        success:()=>{
          wx.reLauch({
            uel:'/pages/login/login'
          })
        }
      })
    }
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    this.getRecommendList();
    PubSub.subscribe('switchMusic',(msg,type)=>{
      let {recommendList,index} = this.data;
      if(type === 'pre'){
        (index===0)&&(index=recommendList.length)
        index-=1;
      }else{
        (index==recommendList.length)&&(index=-1)
        index+=1;
      }
      this.setData({
        index
      })
      let musicId = recommendList[index].id;
      PubSub.publish('musicId',musicId);
    })
  },
  async getRecommendList(){
    let recommendListData = await request('/recommend/songs');
    this.setData({
      recommendList:recommendListData.recommend
    })
  },
  //跳转至songDetail页面
  toSongDetail(event){
    let {song,index} = event.currentTarget.dataset;
    this.setData({
      index
    })
    //路由跳转 query
    wx.navigateTo({
      url:'/pages/songDetail/songDetail?musicId=' + song.id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})