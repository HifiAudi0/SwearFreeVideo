from youtube_transcript_api import YouTubeTranscriptApi
import json


video_id = '_SvIzSD0USE'

# retrieve the available transcripts
transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

# iterate over all available transcripts
for transcript in transcript_list:

    # the Transcript object provides metadata properties
    print(
        transcript.video_id,
        transcript.language,
        transcript.language_code,
        # whether it has been manually created or generated by YouTube
        transcript.is_generated,
        # whether this transcript can be translated or not
        transcript.is_translatable,
        # a list of languages the transcript can be translated to
        transcript.translation_languages,
    )

    # fetch the actual transcript data
    print(transcript.fetch())

    # translating the transcript will return another transcript object
    print(transcript.translate('en').fetch())

# you can also directly filter for the language you are looking for, using the transcript list
transcript = transcript_list.find_transcript(['de', 'en'])  

# or just filter for manually created transcripts  
# transcript = transcript_list.find_manually_created_transcript(['de', 'en'])  

# or automatically generated ones  
# transcript = transcript_list.find_generated_transcript(['de', 'en'])


# Write the transcript to a file as a json object
with open(video_id + '.json', 'w') as outfile:
    json.dump(transcript.fetch(), outfile)

