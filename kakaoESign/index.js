const express = require("express");
const kakaocert = require("kakaocert");
const app = express();

const port = 3000;

kakaocert.config({
  // 링크아이디
  LinkID: "PARA_KC",

  // 비밀키
  SecretKey: "Sl73Sm0ZMBJzcs4fgvD4UCfjBeZAoKP6AUUhxGkphWs=",

  // 인증토큰 IP제한기능 사용여부, 권장(true)
  IPRestrictOnOff: true,

  // 인증토큰정보 로컬서버 시간 사용여부
  UseLocalTimeYN: true,

  // 카카오써트 API 서비스 고정 IP 사용여부, true-사용, false-미사용, 기본값(false)
  UseStaticIP: false,

  defaultErrorHandler: function (Error) {
    console.log("Error Occur : [" + Error.code + "] " + Error.message);
  },
});

var kakaocertService = kakaocert.KakaocertService();

app.get("/requestESign", (req, res) => {
  // Kakaocert 이용기관코드, Kakaocert 파트너 사이트에서 확인
  var clientCode = "022010000004";

  // 전자서명 요청정보 객체
  var requestESign = {
    // 고객센터 전화번호, 카카오톡 인증메시지 중 "고객센터" 항목에 표시
    CallCenterNum: "070-8064-6745",

    // 인증요청 만료시간(초), 최대값 1000, 인증요청 만료시간(초) 내에 미인증시 만료 상태로 처리됨
    Expires_in: 60,

    // 수신자 생년월일, 형식 : YYYYMMDD
    ReceiverBirthDay: req.query.birthday,

    // 수신자 휴대폰번호
    ReceiverHP: req.query.phoneNumber,

    // 수신자 성명
    ReceiverName: req.query.name,

    // 별칭코드, 이용기관이 생성한 별칭코드 (파트너 사이트에서 확인가능)
    // 카카오톡 인증메시지 중 "요청기관" 항목에 표시
    // 별칭코드 미 기재시 이용기관의 이용기관명이 "요청기관" 항목에 표시
    SubClientID: "",

    // 인증요청 메시지 부가내용, 카카오톡 인증메시지 중 상단에 표시
    TMSMessage: "인증 요청이 도착했습니다.",

    // 인증요청 메시지 제목, 카카오톡 인증메시지 중 "요청구분" 항목에 표시
    TMSTitle: "전자서명 - 신용조회",

    // 은행계좌 실명확인 생략여부
    // true : 은행계좌 실명확인 절차를 생략
    // false : 은행계좌 실명확인 절차를 진행
    // 카카오톡 인증메시지를 수신한 사용자가 카카오인증 비회원일 경우, 카카오인증 회원등록 절차를 거쳐 은행계좌 실명확인 절차를 밟은 다음 전자서명 가능
    isAllowSimpleRegistYN: true,

    // 수신자 실명확인 여부
    // true : 카카오페이가 본인인증을 통해 확보한 사용자 실명과 ReceiverName 값을 비교
    // false : 카카오페이가 본인인증을 통해 확보한 사용자 실명과 RecevierName 값을 비교하지 않음.
    isVerifyNameYN: false,

    // 전자서명할 토큰 원문
    Token: "Token Value",

    // PayLoad, 이용기관이 생성한 payload(메모) 값
    PayLoad: "Payload",

    // AppToApp 방식 인증여부
    isAppUseYN: true,
  };

  kakaocertService.requestESign(clientCode, requestESign,
    function (result) {
      res.send({ path: req.path, receiptId: result.receiptId, tx_id: result.tx_id });
    },
    function (error) {
      res.send({ path: req.path, code: error.code, message: error.message });
    }
  );
});

app.get("/getESign", (req, res) => {
  // Kakaocert 이용기관코드, Kakaocert 파트너 사이트에서 확인
  var clientCode = '022010000004';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = req.query.receiptId;

  kakaocertService.getESignState(clientCode, receiptId,
    function(response){
        res.send({ path: req.path, result: response });
    }, function(error){
        res.send({ path: req.path, code: error.code, message: error.message });
    }
  );

})

app.get("/verifyESign", (req, res) => {
  // Kakaocert 이용기관코드, Kakaocert 파트너 사이트에서 확인
  var clientCode = "022010000004";

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = req.query.receiptId;

  // 앱스킴 success시 반환된 서명값(Android:signature, iOS:sig)
  var signature = req.query.signature;

  kakaocertService.verifyESign(clientCode, receiptId, signature,
    function (response) {
      res.send({ path: req.path, result: response })
    },
    function (error) {
      res.send({ path: req.path, code: error.code, message: error.message });
    }
  );
});

app.listen(port, () => {
  console.log("Server start...");
});
