$(document).ready(function () {
    $("#card-bundle").html("");
    showArticles();
    getImage();
});

let tot = {
    location: undefined
}
let map;
let img_path;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 37.5642135, lng: 127.0016985},
        zoom: 8,
    });

    // 여기서 부터 수정- 마커 찍기!!!!!!!
    // for (let i = 0; i < tot.length; i++) {
    //     let marker = new google.maps.Marker({
    //         map: map,
    //         label: location[i].place,
    //         position: new google.maps.LatLng(tot.location.lat, tot.location.lng),
    //     });
    //
    //     google.maps.event.addListener(marker, 'click', (function (marker, i) {
    //         return function () {
    //             infowindow.setContent('#post-trip-place');
    //             infowindow.open(map, marker);
    //         }
    //     })(marker, i));
    // }

    let geocoder = new google.maps.Geocoder();

// submit 버튼 클릭 이벤트 실행
    document.getElementById('geo-submit').addEventListener('click', function () {

        // 여기서 실행
        geocodeAddress(geocoder, map);
    });

    /**
     * geocodeAddress
     *
     * 입력한 주소로 맵의 좌표를 바꾼다.
     */
    function geocodeAddress(geocoder, resultMap) {

        // 주소 설정
        let address = document.getElementById("post-trip-place").value;

        /**
         * 입력받은 주소로 좌표에 맵 마커를 찍는다.
         * 1번째 파라미터 : 주소 등 여러가지.
         *      ㄴ 참고 : https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingRequests
         *
         * 2번째 파라미터의 함수
         *      ㄴ result : 결과값
         *      ㄴ status : 상태. OK가 나오면 정상.
         */
        geocoder.geocode({'address': address}, function (result, status) {

            if (status === 'OK') {
                // 맵의 중심 좌표를 설정한다.
                resultMap.setCenter(result[0].geometry.location);
                // 맵의 확대 정도를 설정한다.
                resultMap.setZoom(18);
                // 맵 마커
                let marker = new google.maps.Marker({
                    map: resultMap,
                    position: result[0].geometry.location
                });

                tot.location = {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()}

                $('#post-trip-location').val(tot.location.lat + '/' + tot.location.lng);
                // // 위도
                // latitude = marker.position.lat();
                // // 경도
                // longitude = marker.position.lng();
            } else {
                alert('지오코드가 다음의 이유로 성공하지 못했습니다 : ' + status);
            }
        });
    }
}

// // 마커 생성함수
// function createMarkers() {
//     for (let i = 0; i < location.length; i++) {
//         let mker = new google.maps.Marker({
//             position: tot.location[i],
//             map,
//             animation: google.maps.Animation.DROP,
//         })
//
//         markers.push(mker);
//     }
//     // console.log('markers')
//     // console.log(markers);
//     // Add a marker clusterer to manage the markers.
//     // 클러스터링
//     markerCluster = new MarkerClusterer(map, markers, {
//         imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
//         gridSize: 100
//     });
// }
//
// function refreshMap() {
//     if (markerCluster instanceof MarkerClusterer) {
//         // Clear all clusters and markers
//         markerCluster.clearMarkers()
//     }
//     markers = [];
//     createMarkers();
// }


// async function uploadImgPreview() {
//     // 업로드 파일 읽기
//     const fileInfo = document.getElementById("uploadFile").files[0];
//     const tags = await ExifReader.load(fileInfo, {expanded: true});
//     console.log(tags);
// }

// function uploadImgPreview() {
//
//     // 업로드 파일 읽기
//     const fileInfo = document.getElementById("uploadFile").files[0];
//     const reader = new FileReader();
//
//     // readAsDataURL( )을 통해 파일을 읽어 들일때 onload가 실행
//     reader.onload = function () {
//
//         EXIF.getData(fileInfo, () => {
//
//             const tags = EXIF.getAllTags(fileInfo);
//
//             // 객체 내용 확인하기
//             console.dir(tags);
//
//             // 메타데이터 값 얻기
//             console.log(tags.Artist);
//             console.log(tags.Orientation);
//
//             // 모든 키와 해당 키의 값 얻기
//             for (let key in tags) {
//                 console.log(key);
//                 console.log(tags[key]);
//             }
//         });
//
//         // 파일의 URL을 Base64 형태로 가져온다.
//         document.getElementById("thumbnailImg").src = reader.result;
//     };
//
//     if (fileInfo) {
//
//         // readAsDataURL( )을 통해 파일의 URL을 읽어온다.
//         reader.readAsDataURL(fileInfo);
//     }
//
function openClose() {
    // id 값 post-box의 display 값이 block 이면
    if ($('#posting-box').css('display') === 'block') {
        // post-box를 가리고
        $('#posting-box').hide();
    } else {
        // 아니면 post-box를 보여주기
        $('#posting-box').show();
    }
}

function getImage() {
    $.ajax({
        type: 'GET',
        url: '/trip',
        success: function (res) {
            let images = res['images']
            for (let i = 0; i < images.length; i++) {
                let image = images[i]
                console.log(image)
                let temp = `<img src="${image}" alt="image${i}">`
                $('.card-img').append(temp)
            }
        }
    })
}

function uploadImage() {
    let images = $('#post-img')[0].files[0]
    if (images === undefined) {
        alert('이미지를 선택해주세요.')
        return
    }

    let formData = new FormData();
    formData.append("images", images)

    $.ajax({
        type: "POST",
        url: "/image",
        processData: false,
        contentType: false,
        data: formData,
        success: function (res) {
            if (res['result'] === 'success') {
                img_path = res['img_path']
                alert('사진 업로드 성공!')
                console.log(img_path);
            } else {
                alert('사진 업로드 실패!')
                console.error(res['error'])
            }
        }
    })
}

function postArticle() {
    const writer = $("#post-writer").val();
    const date = $("#post-trip-date").val();
    const place = $("#post-trip-place").val();
    const content = $("#post-trip-content").val();

    // POST 방식으로 카드 생성 요청하기
    $.ajax({
        type: "POST", // POST 방식으로 요청하겠다.
        url: "/trip", // /memo라는 url에 요청하겠다.
        data: {
            writer_give: writer,
            date_give: date,
            place_give: place,
            lat_give: tot.location.lat,
            lng_give: tot.location.lng,
            img_give: img_path,
            content_give: content
        }, // 데이터를 주는 방법
        success: function (response) { // 성공하면
            if (response["result"] === "success") {
                alert("포스팅 성공!");
                // 3. 성공 시 페이지 새로고침하기
                window.location.reload();
            } else {
                alert("서버 오류!");
            }
        }
    })
}

function showArticles() {
    $.ajax({
        type: "GET",
        url: "/trip",
        data: {},
        success: function (response) {
            const articles = response["articles"];
            console.log(articles);
            for (let i = 0; i < articles.length; i++) {
                // 마커 지도에 저장하기
                let marker = new google.maps.Marker({
                    map: map,
                    position: {
                        lat: Number(articles[i]['lat']),
                        lng: Number(articles[i]['lng']),
                    }
                });
                makeCard(articles[i]["writer"], articles[i]["img"], articles[i]["date"], articles[i]["place"], articles[i]["content"]);
            }
        }
    })
}

function makeCard(writer, img, date, place, content) {
    const tempHtml = `<div class="cards-box">
                      <div class="card">
                        <span class="card-writer">Writer ${writer}</span>
                        <img class="card-img" src="${img}">
                        <span class="card-trip-date">여행 날짜: ${date}</span>
                        <span class="card-trip-place">여행 장소: ${place}</span>
                        <span class="card-trip-content">${content}</span>
                      </div>
                    </div>`;
    $("#card-bundle").append(tempHtml);
}

// 더보기 버튼 js
// const morebutton = document.querySelector('.cards-box .card .morebutton')
// const title = document.querySelector('.cards-box .card .card-trip-content')
// /* html안에 있는 momrebutton을 morebutton 변수에 할당. title도 마찬가지 */

// morebutton.addEventListener('click', () => {
//     morebutton.classList.toggle('clicked');
//     title.classList.toggle('clamp');
// })

// morebutton이 클릭이 되면 morebutton의 클래스를 클릭이
//됐는지 안됐는지 토글을 함. title의 클래스를 클램프 하라는지 안하라는지 
//토글을 할 것임