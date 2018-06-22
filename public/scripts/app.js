/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */



$(document).ready(function() {


  const makeTimeStamp = function(createdAt){
    let currentTime = Date.now();
    // console.log('curr: ' + currentTime);
    // console.log('createdAt: ' + createdAt);

    //  console.log((currentTime - createdAt) / 1000);
    let timeAgo = (currentTime - createdAt) / 1000; //represent seconds passed
    // / 1000 = sec
    //    /60 = min
    //      /60 = hour
    //        /24 = days
    if(timeAgo >= 60){
      timeAgo = timeAgo / 60 ;// represent minutes ago
      if(timeAgo >= 60){
        timeAgo = timeAgo / 60 // represents hours ago
        if(timeAgo >= 24){
          timeAgo = timeAgo / 24;
          if(timeAgo >= 7){
            timeAgo = Math.floor(timeAgo / 7);
            timeAgo += ' weeks ago';
          } else {
            timeAgo = Math.floor(timeAgo) // represent days ago
            timeAgo += ' days ago;'
          }
        } else {
          timeAgo = Math.floor(timeAgo);
          timeAgo += ' hours ago';
        }
      } else {
        timeAgo = Math.floor(timeAgo);
        timeAgo += ' minutes ago';
      }
  } else {
      // timeAgo = Math.floor(timeAgo);
      timeAgo += ' seconds ago';
  }

    return timeAgo;

  }


  //function to create a new "tweet" to add to the feed from a give 'tweet' object

  const createTweetElement = function(tweet) {
    const $newTweet = $(`<article class='tweet'>

                          <header>
                            <img class='avatar' src=${tweet['user']['avatars']['small']}>
                              <h1> ${tweet['user']['name']} </h1>
                                <p> ${tweet['user']['handle']} </p>
                          </header>

                          <div>
                            <p> ${escape(tweet['content']['text'])} </p>
                          </div>

                          <footer>
                            <p> ${makeTimeStamp(tweet['created_at'])} </p>
                            <div>
                              <i class='fas fa-flag'></i>
                              <i class='fas fa-retweet'></i>
                              <i class='far fa-heart'></i>
                            </div>
                          </footer>
                        </article>`);
      return $newTweet;
    }


  //function to load all tweets in database (GET request), then render the tweets with response

  const loadTweets = function() {
      //prevent page auto-reload
      event.preventDefault();
      console.log("Fetching tweets...");

      $.ajax({
        url: '/tweets',
        method: 'GET',
        success: function (allTweets) {
          console.log('success', allTweets);
          renderTweets(allTweets);
        },
        error: function(errormessage){
          console.log('error', errormessage);
        }
      })
    }


  //call load tweets to page will intially load with all current tweets
  loadTweets();


  //function that added each new tweet to the feed
  const renderTweets = function(arrTweets) {

    $('#tweet-feed').empty();

    for (let tweet in arrTweets){
      let tweetToAdd = createTweetElement(arrTweets[tweet])
      $(tweetToAdd).prependTo($('#tweet-feed'));
    }

  }


  //escape function to uses on new tweet text area to prevent cross-site scripting attacks
  function escape(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }


  function warning(message) {
    const $newMessage = $(`<p class='warning'>${message}</p>`)
    $newMessage.appendTo($('.new-tweet h2')).fadeOut(4500);
  }




//event handler for new tweet - form submission

  const $submitTweet = $('.new-tweet input');
  $submitTweet.on('click', function(event) {

    event.preventDefault();

    const tweet = $('.new-tweet textarea')

    if((tweet.val().length) > 140){
      warning('Too many chars there bud...');
    } else if ((tweet.val().length) < 1){
      warning("can't tweet nothingness");
    } else {

      console.log("Tweet submitted! Posting now...");

      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: tweet.serialize(),
        success: function (tweet) {
          console.log('success OVER HERE' + tweet);
          loadTweets();
          $('.new-tweet textarea').val("");
          $('.new-tweet .counter').text(140);
        },
        error: function(errormessage){
          console.log('error', errormessage);
        }
      })
    }

  })




//compose button event listener to toggle the new tweet form display

  const $compose = $('#nav-bar #composeBtn');
  const $tweetForm = $('.new-tweet');

  $compose.on('click', function() {
    $tweetForm.slideToggle(300);
    $('.new-tweet textarea').focus();

  })



});


