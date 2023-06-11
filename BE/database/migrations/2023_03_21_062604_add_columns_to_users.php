<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('course')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('contact')->nullable();
            $table->string('address')->nullable();
            $table->string('mother')->nullable();
            $table->string('father')->nullable();
            $table->string('spouse')->nullable();
            $table->string('children')->nullable();
            $table->string('messenger')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
