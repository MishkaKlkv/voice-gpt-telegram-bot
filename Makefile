build:
	docker build -t voicegpt .build .

run:
	docker run -d -p 3000:3000 --name voicegpt --rm voicegpt
