build:
	docker build -t voicegpt .

run:
	docker run -d -p 3000:3000 --name voicegpt voicegpt
