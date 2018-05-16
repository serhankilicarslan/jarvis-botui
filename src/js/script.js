var recognizer;
var msg;
var botui = new BotUI('jarvis-app');
var app = new Vue({
    el: '#app',
    data: {
      input: "",
      started: false,
      speachActive : false,
      form : {
          senderName: "Serhan",
          senderNumber : "905377303891",
          message : "",
          confidence : ""
      }
    },
    mounted: function () {
      var self = this;
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
      //this.$nextTick(() => this.$refs.input.focus())
      window.onkeyup = function(e) {
         var key = e.keyCode ? e.keyCode : e.which;
        // Key -> Space
        if (key == 32) { self.mic(); }
      }
      this.speachInit();
    },
    computed: {
      SpeechSupported: function () {
        return (window.SpeechRecognition === null);
      }
    },
    watch: {
      input : _.debounce(function (val) {
        this.form.message = val;
        if (this.form.message.trim() != "") this.sendQuery();
      }, 1000)
    },
    methods: {
      mic : function () {
          this.speachActive = !this.started;
          if (this.started) { this.stopSpeech() } 
          else { this.startSpeech() }
      },
      // sendInput : _.debounce(function (e) {
      //   this.form.message = e.target.value;
      //   if (this.form.message.trim() != "") this.sendQuery();
      // }, 1000),
      sendQuery : function (speech) {
          this.input = "";
          this.stopSpeech();
          this.sendBotUI(this.form.message,true);
          this.$http.post('http://178.62.35.11:3003/', this.form).then(function(res,err) {
              this.bindResponse(res.body);
          });
      },
      sendBotUI : function (text,human) {
        botui.message.add({
          human: human,
          content: text
        });
      },
      bindResponse : function (text) {
        this.sendBotUI(text,false);
        this.speach(text);
      },
      speach : function (text) {
          sepachInit(text);
          window.speechSynthesis.speak(msg);
      },
      startSpeech: function () {
        try { 
          recognizer.start();
          this.started = true;
          console.log("Started");
        } 
        catch(ex) { 
          console.log(ex.message); 
        }
      },
      stopSpeech: function () {
        this.started = false;
        recognizer.stop();
        console.log("Stoped");
      },
      speachInit : function () {
          if (!this.SpeechSupported) {
            recognizer = new window.SpeechRecognition();
            recognizer.continuous = true;
            recognizer.interimResults = true
            recognizer.onresult = function(event) {
              if (app.started)
              for (var i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                  app.input = event.results[i][0].transcript;
                  app.form.confidence = event.results[i][0].confidence;
                } else {
                  app.input = event.results[i][0].transcript;
                }
              }
            }
            recognizer.onerror = function(event) {
              app.started = false;
              console.log(event.error)
            }
          }
      }
    }
});

function sepachInit (text) {
  msg = new SpeechSynthesisUtterance(text);
  msg.volume = 2;
  msg.lang = "tr-TR"
  msg.pitch = 1;
  msg.onend = function(e) {
    console.log('Finished in ' + event.elapsedTime + ' seconds.');
    console.log(app.speachActive);
    if (app.speachActive) app.startSpeech();
  }
}