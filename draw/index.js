(function (factory) {
	"use strict";
	factory();
})(function () {
	var EditorImage = function (op) {
		return new EditorImage.fn.init(op);
	};

	EditorImage.fn = EditorImage.prototype;

	EditorImage.fn.init = function (op) {
		if (!this.isElement(op.container) || !this.isElement(op.upBtn)) {
			throw "Wrong parameters entered";
			return false;
		}
		this.extend(this, op);
		this.getWidthHeight();
		// console.log(this);
		this.upBtn.addEventListener("change", this.uploader.bind(this));
	};

	EditorImage.fn.init.prototype = EditorImage.fn;

	EditorImage.fn.extend = function () {
		//简单的浅拷贝方法
		var i = 1,
			options,
			name,
			length = arguments.length,
			target = arguments[0] || {};
		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					target[name] = options[name];
				}
			}
		}
		return target;
	};

	EditorImage.fn.isElement = function (obj) {
		if (obj && obj.nodeType === 1) {
			if (window.Node && obj instanceof Node) {
				return true;
			}
		}
	};

	EditorImage.fn.getWidthHeight = function () {
		var rect = this.container.getBoundingClientRect();
		this.wi = this.wi ? this.wi : rect.width;
		this.he = this.he ? this.he : rect.height;
	};

	EditorImage.fn.uploader = function (e) {
		let reader = new FileReader(),
			self = this;
		reader.readAsDataURL(e.target.files[0], "utf8");
		reader.onload = () => {
			var img = new Image(),
				imgWi = null,
				imgHe = null,
				scale = 0;
			img.onload = function () {
				imgWi = img.width;
				imgHe = img.height;
				if (imgWi < self.maxWidth) {
					self.errorMessage();
					return false;
				}
				self.canvas(true);
				scale = (self.wi / imgWi) * 2;
				self.ctx.drawImage(img, 0, 0, self.wi * 2, imgHe * scale);
			};
			img.src = reader.result;
		};
	};

	EditorImage.fn.canvas = function (add) {
		if (this.container.getElementsByTagName("canvas")[0]) {
			this.container.getElementsByTagName("canvas")[0] = null;
			this.container.removeChild(
				this.container.getElementsByTagName("canvas")[0]
			);
		}
		if (!add) return false;
		var ca = (this.ca = document.createElement("canvas"));
		ca.width = this.wi * 2;
		ca.height = this.he * 2;
		ca.style =
			"width:" + this.wi + "px;height: " + this.he + "px;cursor: grab;";
		this.container.appendChild(ca);
		ca.addEventListener("mousedown", this.down.bind(this), false);
		ca.addEventListener("mouseup", this.up.bind(this), false);
		ca.addEventListener("mouseout", this.up.bind(this), false);
		this.ctx = ca.getContext("2d");
	};

	EditorImage.fn.draw = function () {};

	EditorImage.fn.down = function (e) {
		this.startX = e.offsetX;
		this.startY = e.offsetY;
		this.ca.addEventListener("mousemove", this, false);
	};

	EditorImage.fn.handleEvent = function (e) {
		//定制函数handleEvent是当addEventListener的第二个参数为一个对象时，默认执行的方法，
		//这样可以做到改变this的指向，又能删除监听事件
		console.log(e.offsetX, e.offsetY);
	};

	EditorImage.fn.up = function (e) {
		this.ca.removeEventListener("mousemove", this, false);
	};

	window.EditorImage = window._$ = EditorImage;
	return EditorImage;
});
