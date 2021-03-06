/**
 * 
 * @param {*} reducer   //reducer
 * @param {*} initState    //初始状态
 * @param {*} middleware   //中间件
 */
const createStore = (reducer, initState,enhancer) => {

    let initialState;       //用于保存状态
    let currentReducer = reducer;        //reducer
    let listenerQueue = []; //存放所有的监听函数
    let isDispatch = false;

    if(initState){
        initialState = initState;
    }

    if(enhancer){
        return enhancer(createStore)(reducer,initState);
    }
    /**
     * 获取Store
     */
    const getState = () => {
        //判断是否正在派发
        if(isDispatch){
            throw new Error('dispatching...')
        }
        return initialState;
    }

    /**
     * 派发action 并触发所有的listeners
     * @param {*} action 
     */
    const dispatch = (action) => {
        //判断是否正在派发
        if(isDispatch){
            throw new Error('dispatching...')
        }
        try{
           isDispatch = true;
           initialState = currentReducer(initialState,action);
        }finally{
            isDispatch = false;
        }
        //执行所有的监听函数
        for(let listener of listenerQueue){
            listener.apply(null);
        }
    }
    /**
     * 订阅监听
     * @param {*} listener 
     */
    const subscribe = (listener) => {
        listenerQueue.push(listener);
        //移除监听
        return function unscribe(){
            let index = listenerQueue.indexOf(listener);
            let unListener = listenerQueue.splice(index,1);
            return unListener;
        }
    }

    /**
     * 替换reducer
     * @param {*} reducer 
     */
    const replaceReducer = (reducer) => {
        if(reducer){
            currentReducer = reducer;
        }
        dispatch({type:'REPLACE'});

    }
    dispatch({type:'INIT'});
    return {
        getState,
        dispatch,
        subscribe,
        replaceReducer
    }
}

export default createStore;