function randompic() {
	var i = Math.floor(Math.random() * 5);//随机选取照片
	var src = "";
	switch (i) {
		case 0:
			src = "../img/000.jpg";
			break;
		case 1:
			src = "../img/111.jpg";
			break;
		case 2:
			src = "../img/222.jpg";
			break;
		case 3:
			src = "../img/333.jpg";
			break;
		case 4:
			src = "../img/444.jpg";
			break;
	}
	document.body.background = src;
	setTimeout("randompic()", 6000);
}
var fillData = function (arr) {

}

$('#btn1').on('click', function () {
	$.ajax(
		{
			type: 'POST',
			url: '/login',
			data: {},
			success: function (result) {
				console.log(result)
			}
		}
	)
})
$('#testing').on('blur', function () {
	var inputData = $('#testing').val()
	// console.log('1654')
	$.ajax(
		{
			type: 'POST',
			url: '/test',
			data: {inputData : inputData},
			success: function (result) {
				console.log(result.code)
				if(result.code){
					console.log('.code')
					$('.unremin').addClass('remin')
					$('.unremin').removeClass('unremin')

				}else{
					if($('.a').hasClass('remin')){
						$('.a').removeClass('remin')
						$('.a').addClass('unremin')
					}
				}

			}
		}
	)
})
