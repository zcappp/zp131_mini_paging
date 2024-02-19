import React from "react"

function render(ref) {
    const { props } = ref
    if (!props.path || typeof props.path !== "string") return <div>请配置数据路径</div>
    const x = ref.excA(props.path.startsWith("$c.x") ? props.path : "$c.x." + props.path)
    if (!x || !x.arr) return <div/>
    return <React.Fragment>        
        <a onClick={() => prev(ref, x)} className={x.skip ? "" : "disabled"}>{SVG.prev}</a>
        <span><input value={ref.input !== undefined ? ref.input : x.skip / x.limit + 1} onChange={e => onChange(ref, x, e)} type="number" className="zinput" autoComplete="off"/><span> / {Math.ceil(x.count / x.limit)}</span></span>
        <a onClick={() => next(ref, x)} className={x.count > x.skip + x.limit ? "" : "disabled"}>{SVG.next}</a>
    </React.Fragment>
}

function prev(ref, x) {
    delete ref.input
    let O = JSON.parse(x.option)
    O.skip = x.skip - x.limit
    if (O.skip >= 0) search(ref, x, O)
}

function next(ref, x) {
    delete ref.input
    let O = JSON.parse(x.option)
    O.skip = x.skip + x.limit
    if (O.skip < x.count) search(ref, x, O)
}

function onChange(ref, x, e) {
    ref.input = e.target.value
    let O = JSON.parse(x.option)
    O.skip = (parseInt(ref.input || 1) - 1) * x.limit
    if (O.skip >= 0 && O.skip < x.count) search(ref, x, O)
}

function search(ref, x, O) {
    ref.exc(`$${x.model}.search(x.path, Q, O, x.cache)`, { x, Q: JSON.parse(x.query), O }, () => {
        ref.exc("render()")
        if (ref.props.onPageChanged) ref.exc(ref.props.onPageChanged, Object.assign({}, ref.ctx, O), () => ref.exc("render()"))
    })
}

const css = `
.zp131 {
    text-align: center;
    margin: 20px;
}
.zp131 > a,
.zp131 > span {
    padding: 0 9px;
}
.zp131 > span > span {
    vertical-align: middle;
}
.zp131 input {
    width: 45px;
    text-align: center;
    padding: 2px;
    height: 100%;
}
.zp131 svg:hover {
    color: #1890ff;
}
.zp131 .disabled svg {
    fill: silver;
    cursor: not-allowed;
}
`

$plugin({
    id: "zp131",
    props: [{
        prop: "path",
        type: "text",
        label: "路径",
        ph: "search()的第一个参赛"
    }, {
        prop: "onPageChanged",
        type: "exp",
        label: "onPageChanged"
    }],
    render,
    css
})

const SVG = {
    prev: <svg className="zsvg" viewBox="64 64 896 896"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"/></svg>,
    next: <svg className="zsvg" style={{transform: "rotate(180deg)"}} viewBox="64 64 896 896"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"/></svg>
}