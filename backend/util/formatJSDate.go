package util

import "time"

func FormatJSDate(t string) time.Time {
	time, err := time.Parse(time.RFC3339, t)
	if err != nil {
		panic("datetime input format incorrect")
	}
	return time
}
