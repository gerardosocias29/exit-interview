<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CourseController extends Controller
{
    public function index() {
      $c = Course::all();
      return response($c);
    }

    public function register(Request $request) {
      $fields = $request->validate([
        'name' => 'required|string'
      ]);

      $c = Course::create([
        'name' => $fields['name']
      ]);

      return response($c, 201);
    }
}
