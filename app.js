var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
Math.sign = Math.sign || function (x) {
    x = +x;
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
};
var FXComponent = (function (_super) {
    __extends(FXComponent, _super);
    function FXComponent(props) {
        _super.call(this, props);
        this.state = { fxRates: [] };
    }
    FXComponent.prototype.componentDidMount = function () {
        var _this = this;
        io().on("data", function (data) { return _this.setState({ fxRates: data }); });
    };
    FXComponent.prototype.render = function () {
        return (React.createElement("table", null, 
            React.createElement("tbody", null, this.state.fxRates.map(function (rate) { return (React.createElement(FXRow, {key: rate.currencyPair, data: rate})); }))
        ));
    };
    return FXComponent;
}(React.Component));
var Direction = function (_a) {
    var _b = _a.val, val = _b === void 0 ? 0 : _b;
    return val === -1 ?
        React.createElement("td", {style: { color: "red" }}, "\u25bc") :
        React.createElement("td", {style: { color: "green" }}, (val !== 0) && "\u25b2");
};
var FXRow = (function (_super) {
    __extends(FXRow, _super);
    function FXRow(props) {
        _super.call(this, props);
        this.state = { direction: 0, changed: false };
    }
    FXRow.prototype.componentWillReceiveProps = function (nextProps) {
        var prev = this.props.data;
        var latest = nextProps.data;
        var prevBid = +prev.bidBig + prev.bidPips;
        var bid = +latest.bidBig + latest.bidPips;
        var diff = bid - prevBid;
        this.setState({ changed: !!diff });
        if (diff === 0)
            return;
        this.setState({ direction: Math.sign(diff) });
    };
    FXRow.prototype.render = function () {
        return (React.createElement("tr", null, 
            React.createElement("td", {className: "price",style: { 'color': (this.state.changed ? '#ccc' : '#eee') }}, 
                this.props.data.bidBig, 
                React.createElement("sup", null, this.props.data.bidPips)), 
            React.createElement(Direction, {val: this.state.direction}),
			            React.createElement("td", {className: "currencyPair"}, this.props.data.currencyPair)

			));
    };
    return FXRow;
}(React.Component));
ReactDOM.render(React.createElement(FXComponent, null), document.getElementById("root"));
