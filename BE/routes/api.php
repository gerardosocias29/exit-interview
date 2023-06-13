<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\OptionsController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\UserFormController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('register/', [UserController::class, 'register']);
Route::post('login/', [UserController::class, 'login']);
Route::get('form/', [FormController::class, 'index']);
Route::resource('options', OptionsController::class);
Route::get('course/', [CourseController::class, 'index']);
Route::resource('answer', AnswerController::class);

Route::group(['middleware' => ['auth:sanctum']], function() {
  //Route::resource('form', FormController::class);
  Route::get('form/{id}', [FormController::class, 'show']);
  Route::get('/form/{id}/details', [FormController::class, 'details']);
  Route::delete('/form/{id}', [FormController::class, 'destroy']);

  Route::resource('question', QuestionController::class);
  Route::get('question/{id}/response', [QuestionController::class, 'showGroup']);
  Route::get('/form/{id}/questions/', [QuestionController::class, 'index']);
  Route::get('/form/{id}/questions/answers', [QuestionController::class, 'show']);

  Route::resource('user-form', UserFormController::class);
  
  // Route::resource('answer', AnswerController::class);
  Route::get('/recommendations', [AnswerController::class, 'recommendations']);

  Route::post('course/create', [CourseController::class, 'register']);
  // Route::get('course/', [CourseController::class, 'index']);

  Route::get('users/', [UserController::class, 'show']);
  Route::post('logout/', [UserController::class, 'logout']);
  Route::post('update/', [UserController::class, 'updateAdmin']);
});

Route::get('dashboard_details/', [DashboardController::class, 'index']);