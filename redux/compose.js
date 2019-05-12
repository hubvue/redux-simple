/**
 * 组合函数
 * @param  {...any} fns 
 */
const compose = (...fns) => {
    let flag = fns.every(fn => typeof fn === 'function');

    if(!flag){
        throw new TypeError("arguments is not function");
    }

    return fns.reduce((f,g) => (...args) => f(g(...args)));
}

export default compose;