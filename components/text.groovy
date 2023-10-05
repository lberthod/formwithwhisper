1 = ("Etes-vous capable de vous déplacer dans votre appartement sans crainte")
2=("Utilisez-vous un moyen auxiliaire lorsque vous vous déplacer dans votre appartement ?")
3= ("La porte de votre salle de bain possède-t-elle un seuil ?")
4= ("Est-il difficile pour vous d’enjamber ce seuil en toute sécurité ?")
5=("Nous vous conseillons de prendre contact avec un ergothérapeute afin que vous puissiez trouvez une solution pour vous sentir davantage en sécurité lorsque vous enjambez le seuil de votre salle de bain. Votre seuil pourrait par exemple être aplani.") 
6=("Lorsque vous êtes dans votre salle de bain, avez-vous l’impression que la luminosité est suffisante ?")
7=("Nous vous conseillons d’améliorer la luminosité à l’intérieur de votre salle de bain.  Vous pourriez par exemple modifier l’ampoule de la lampe existante, ou ajouter une lampe d’appoint dans votre salle de bain")
8= ("Arrivez-vous à allumer et à éteindre facilement la lumière de la salle de bain ?")
9=("Nous vous conseillons d’installer une ampoule à détecteur de mouvement dans votre salle de bain. De telles ampoules sont disponibles par exemple à Micasa, à Jumbo, à Hornbach et à Do it + Garten et coûtent entre 15 et 20 CHFs. ")
10=("Est-il difficile pour vous de rester plus de 30 minutes debout ?")
11= ("Avez-vous un endroit pour vous asseoir dans la salle de bain ?")
12=("Nous vous conseillons d’installer une chaise ou un tabouret dans votre salle de bain. Si cela n’est pas possible, nous vous conseillons de contacter un ergothérapeute afin qu’une solution puisse être trouvée avec lui.")
13=("Votre salle de bain est-elle encombrée ?")
14=("Nous vous conseillons de désencombrer votre salle de bain, c’est-à-dire d’enlever les choses superflues et de faire de l’ordre, afin optimiser la place et de pouvoir vous y déplacer plus librement.")
15=("Avez-vous des tapis dans votre salle de bain?")
16=("Vos tapis sont-ils fixés au sol ?")
17=("Nous vous conseillons d’enlever les tapis de votre salle de bain ou de les fixer au sol.")
18=("Arrivez-vous à accéder facilement à vos affaires de toilettes à la salle de bain ?")
19=("Nous vous conseillons de réorganiser les espaces de rangement de votre salle de bain afin que vous puissiez accéder plus facilement à vos affaires de toilettes, par exemple en plaçant les affaires que vous utilisez régulièrement à la hauteur de votre tronc.")
20=("Le mobilier de votre salle de bain est-il stable ?")
            if quest == "Non":
                speak("Nous vous conseillons d’entreprendre des démarches afin que l’ensemble du mobilier de votre salle de bain soit installé de manière stable.")
            quest= ask("-	Les prises électriques de la salle de bain sont-elles en bon état (c’est-à-dire qu’elles ne sont pas endommagées) ?")
            if quest == "Non":
                speak("Nous vous conseillons de faire intervenir un électricien afin de remettre les prises électriques en bon état.")
                
                
            quest= ask("-	Les cordons électriques des appareils que vous utilisez à la salle de bain sont-ils en bon état (c’est-à-dire que le caoutchouc n’est pas endommagé) ?")
            if quest  == "Non" :
                speak("Nous vous conseillons de changer le matériel dont les cordons électriques ne sont pas en bon état.")
                
            
            quest= ask("Nous vous conseillons de changer le matériel dont les cordons électriques ne sont pas en bon état.")
            if quest == "Non":
                speak("Si votre lavabo vous semble trop haut, nous vous conseillons de prendre contact avec un ergothérapeute afin de trouver une solution pour que vous puissiez utiliser le lavabo de manière plus sécuritaire. Si votre lavabo vous semble trop bas, vous pouvez essayer d’installer une chaise devant celui-ci pour pouvoir l’utiliser en position assise. ")
            quest= ask("Avez-vous une baignoire que vous utilisez ?")
            if quest == "Oui":
                
                quest= ask("Arrivez-vous à entrer et à sortir facilement de la baignoire ?")
                if quest == "Non":
                    speak("Nous vous conseillons de contacter un ergothérapeute afin de trouver une solution pour que vous puissiez entrer et sortir plus facilement de la baignoire. Il existe différentes solutions pour cela.  ")
                quest= ask("Vous sentez-vous en sécurité lorsque vous utilisez votre baignoire ?")
                if quest =="Non":
                    speak("Nous vous conseillons de contacter un ergothérapeute afin de trouver une solution pour que vous vous sentiez davantage en sécurité lorsque vous utilisez votre baignoire. Il existe différentes solutions pour cela. Vous pourriez par exemple : ")
                    
                    
            quest= ask("Avez-vous une douche que vous utilisez ?")
            if quest =="Oui":
                ask("Arrivez-vous à entrer et à sortir facilement de la douche ?")
                if quest == "Non":
                    speak("Nous vous conseillons de contacter un ergothérapeute afin de trouver une solution pour que vous puissiez entrer et sortir plus facilement de la douche. Il existe différentes solutions pour cela. Vous pourriez par exemple : ")
                quest= ask("Vous sentez-vous en sécurité lorsque vous utilisez votre douche ?")
                if quest =="Non":
                    speak("Nous vous conseillons de contacter un ergothérapeute afin de trouver une solution pour que vous vous sentiez davantage en sécurité lorsque vous utilisez votre douche. Il existe différentes solutions pour cela. Vous pourriez par exemple : ")
                    
            quest= ask("Arrivez-vous à vous asseoir et à vous lever facilement des toilettes ?")
            if quest =="Non":
                speak("Nous vous conseillons de contacter un ergothérapeute afin de trouver une solution pour que vous puissiez vous asseoir et vous lever plus facilement des toilettes. Il existe différentes solutions pour cela. ")
                
     