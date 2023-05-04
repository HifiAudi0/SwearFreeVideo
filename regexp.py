import re
import sys

string = str(sys.argv[1])
print(string ,"....")

result = re.search("^\w{11}$", string)

if not result:
    exit("Python Error: Invalid video ID, intentionally exiting")


print("never run here if invalid video_id..")

print ("result....", result)
