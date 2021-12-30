package models

import "time"

type Task struct {
	Id        uint      `gorm:"primarykey" json:"id"`
	Name      string    `json:"name"`
	DueDate   time.Time `json:"dueDate"`
	Done      bool      `gorm:"default:false" json:"done"`
	Deleted   bool      `gorm:"default:false" json:"deleted"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
	ListId    int       `gorm:"not null" json:"listId"`
	Labels    []Label   `gorm:"many2many:task_label" json:"labels"`
}
