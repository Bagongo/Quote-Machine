$(window).on("load", function(){
    
    var quotesPool = [];
            var gamestate = "begin";
            var currentQt = null;
            var realQuotesApi = "https://gist.githubusercontent.com/dmakk767/9375ff01aff76f1788aead1df9a66338/raw/491f8c2e91b7d3b8f1c8230e32d9c9bc1a1adfa6/Quotes.json%2520";
            var phoneyQuote = {
                quote:"KHBkdlòsadl,-s,dàdeò,s fòamòlmf3òref9cw4240jq4294fàdf,  eqkmw3omldf3daò,fdòlfdsòflmdaskm",
                author:"- My cat, walking on the keyboard",
                realAuthor: "me"
            };
            var chachedQR = $("#result-display").children("p").html();
            var totalGames = 0;
            var finalRollsCounter = 0;
            var maxRolls = 0;

            console.log("consider right guess AND author-quote match possibilty!!!!");

            $("#nq-btn").click(function(){            
                if($(this).hasClass("lit"))
                {
                    totalGames++;
                    gamestate = "guessing";
                    fetchQuotes(realQuotesApi, 4); 
                    $("#nq-btn, #twitter-btn").removeClass("lit");
                    $("#twitter-btn").parent().removeAttr("href");
                }
            });

            $(".guess-btn").click(function(){            
                if($(this).hasClass("lit"))
                {
                    var answer = $(this).val() === "true" ? true : false;
                    guessResult(answer);
                    $(".guess-btn").removeClass("lit");
                }
            });

            $("#twitter-btn").click(function(){
                if($(this).hasClass("lit"))
                {
                    $(this).parent().attr("href", "https://twitter.com/intent/tweet?text=" + "'" + currentQt.quote + "'" + "  " + currentQt.realAuthor);
                }
            });

            function fetchQuotes(api, number)
            {                        
                $.getJSON(api, function(data){

                var indexes = [];
                var newIdx;    

                for(var i=0; i < number; i++)
                {
                    newIdx = Math.floor(Math.random() * data.length);

                    while(indexes.includes(newIdx))
                        newIdx = Math.floor(Math.random() * data.length);

                    indexes.push(newIdx);             
                    quotesPool.push(data[newIdx]);               
                }

                    generateQuote();
                });
            }

            function generateQuote()
            {
                var randEvaluation = Math.random();

                if(randEvaluation < 0.1 && totalGames >= 5)
                {               
                   currentQt = phoneyQuote;
                }
                else if(randEvaluation >= 0.1 && randEvaluation <= 0.5)
                {
                    currentQt = {
                        quote:quotesPool[0].quote, 
                        author:"- " + quotesPool[0].name, 
                        realAuthor:"- " + quotesPool[0].name
                    };
                }
                else
                {
                    currentQt = {
                        quote:quotesPool[0].quote, 
                        author:"- " + quotesPool[quotesPool.length - 1].name, 
                        realAuthor:"- " + quotesPool[0].name
                    };    
                }

                quotesPool.shift();            
                rollBars();                        
            }

            function rollBars()
            {
                maxRolls += 3;
                var quotes = quotesPool.map(function(item){return item.quote;})
                var authors = quotesPool.map(function(item){return item.name;});

                multiRoll($("#quote"), quotes.length, quotes, currentQt.quote);
                multiRoll($("#author"), authors.length * 2, authors, currentQt.author);          
                setTimeout(function(){
                    closingRoll($("#result-display"), "Is that the real author of the quote?");
                }, 2500);
            }

            function closingRoll(div, html)
            {
                div.children("p").animate({top:"100%"},250, function(){
                    $(this).html(html);
                    $(this).css("top", "-100%");
                }).animate({top:"0"}, 250).animate({top:"-4px"}, 50).animate({top:"4px"}, 50).animate({top:"-2px"}, 50).animate({top:"0px"}, 50, function(){

                    finalRollsCounter++;
                    if(finalRollsCounter >= maxRolls)
                    {
                        finalRollsCounter = 0;
                        maxRolls = 0;
                        nextAction();                     
                    }
                });             
            }

            var rollCount = 0;
            function multiRoll(div, rolls, arr, html)
            {    
                var idx = rollCount >= arr.length ? rollCount - arr.length : rollCount;
                var randomTxt = arr[idx];

                div.children("p").animate({top:"100%"}, 250, function(){
                    $(this).html(randomTxt);
                    $(this).css("top","-100%");
                });

                if(rollCount < rolls)
                {
                    rollCount++;
                    multiRoll(div, rolls, arr, html);                
                }
                else
                {
                    rollCount = 0;
                    closingRoll(div, html);
                }
            }

            function guessResult(answer)
            {
                var guessed = (currentQt.author === currentQt.realAuthor) === answer;
                var result = guessed ? "Right! " : "Wrong! ";
                var output = result + "It is actually a quote by " + currentQt.realAuthor.replace("-", "");

                if(currentQt.realAuthor === "me")
                    output = "Ok, ok... this one was a joke.";

                gamestate = guessed ? "guessed-right" : "guessed-wrong";

                maxRolls++;
                closingRoll($("#result-display"), output);

                if(guessed && currentQt.realAuthor !== currentQt.author)
                {
                    maxRolls++;
                    closingRoll($("#author"), currentQt.realAuthor);
                }
            }

            function nextAction()
            {
                if(gamestate == "guessed-wrong")                
                    $("#nq-btn").addClass("lit");        
                else if(gamestate == "guessed-right")
                    $("#nq-btn, #twitter-btn").addClass("lit");
                else if(gamestate == "guessing")
                {
                    quotesPool.length = 0;
                    $(".guess-btn").addClass("lit");
                }            
            }
    });