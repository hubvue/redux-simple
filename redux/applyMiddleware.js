import compose from "./compose";
/**
 * applyMiddle可以说是对dispatch的一种增强
 * @param  {...any} middlewares 
 */
//使用柯里化分布传参
const applyMiddleware = (...middlewares) => createStore => (...args) => {
    //获取到createStore的返回方法。
    const store = createStore(...args);
    //定义一个错误dispatch,避免在加载中间件过程中调用，中间件加载完毕，重写dispatch
    let dispatch = () => {
        throw new Error('不可以在中间件中调度')
    }

    
    const middlewareAPI = {
        getState: store.getState,
        dispatch : (...args) =>dispatch(...args) ,
    } 
    //调用所有的middle，返回副作用函数数组
    let chain = middlewares.map(middleware => middleware(middlewareAPI));
    //通过组合函数惰性求值。获得增强的dispatch方法。
    dispatch = compose(...chain)(store.dispatch);
    console.log(dispatch);
    return {
        ...store,
        dispatch,
    }
}
export default applyMiddleware;