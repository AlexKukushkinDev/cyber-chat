# Running Server locally

## Prerequisites

Install MongoDB - see https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

## Run Server

Open it on InteliJIdea and another IDE and run it using embded Tomcat

# API docs

## Generate websocket channel

uniqueStr = generate a channel

1. Using SockKS library, connect to WS server:
```
var socket = new SockJS('/ws/connect/?access_token=' + accessToken);
```
2. Subscribe STOMP client to specific URL:
```
stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        var subUrl = '/ws/stomp/' + accessToken + '/' + uniqueStr;
        stompClient.subscribe(subUrl, function (greeting) {    
        console.log('server response: ' + JSON.parse(greeting.body));
    });
});
```
Where '719f0239-2de7-4e94-9a86-9a7bf569c4b6' is the Url generated on step 1 <br/>
Response Object has following fields:
```
    private String from;

    private String message;

    private Map<String, String> attributes;

    private int subscribers;

    private WSMessage.TYPE type;


```




3. Send a Message
```
stompClient.send("/ws/send/" + accessToken + "/" + uniqueStr, {}, JSON.stringify({'message': 'a message', 'from' : 'UserA'}));
```
Where '719f0239-2de7-4e94-9a86-9a7bf569c4b6' is the Url generated on step 1 <br/>
Send object has following fields:
```
    private String from;

    private String message;

    private Map<String, String> attributes;

    private TYPE type;


    public enum TYPE {
        JOINED,
        SEND,
        RENAME,
        LEFT;

    }
```





