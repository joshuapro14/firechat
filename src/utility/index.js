const debounce = (fun, timeout=300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fun(...args), timeout)
    }
}

const flattenArray = (arr, MAX_DEPTH=10, depthIndex=0) => {
    if(arr == null || depthIndex >= MAX_DEPTH)return arr;
    if(!Array.isArray(arr))return [arr];
    return arr.reduce((acc,curr)=>{
        return Array.isArray(curr)
                ? acc.concat(flattenArray(curr, MAX_DEPTH, depthIndex + 1))
                : acc.concat(curr)
    },[])
}

export {
    debounce,
    flattenArray
}