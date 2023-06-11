<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Questions extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'type', 'placeholder', 'isRequired', 'isFilter', 'status', 'form_id', 'category', 'sub_title'];

    public function options() {
      return $this->hasMany(Options::class, 'question_id');
    }

    public function form() {
      return $this->belongsTo(Forms::class, 'form_id');
    }

    public function answers() {
      return $this->hasMany(Answers::class, 'question_id');
    }
}
