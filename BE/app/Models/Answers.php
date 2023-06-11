<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answers extends Model
{
    use HasFactory;
    protected $fillable = ['description', 'option_id', 'question_id', 'user_form_id', 'remarks', 'subjects_handled', 'reason', 'instructor'];

    public function options(){
      return $this->hasMany(Options::class, 'option_id');
    }

    public function forms(){
      return $this->belongsTo(UserForms::class, 'user_form_id');
    }
}
