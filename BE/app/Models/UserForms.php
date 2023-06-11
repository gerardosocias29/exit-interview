<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserForms extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'form_id'];

    public function users() {
      return $this->belongsTo(User::class, 'user_id');
    }

    public function forms() {
      return $this->belongsTo(Forms::class, 'form_id');
    }

    public function answers() {
      return $this->hasMany(Answers::class, 'user_form_id');
    }
}
