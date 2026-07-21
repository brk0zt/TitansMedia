<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'sqlite') return;

        $pk = 'account_id';
        $info = DB::select("PRAGMA table_info('ad_accounts')");
        $cols = [];
        foreach ($info as $col) {
            $type = strtoupper($col->type);
            $null = ($col->name === $pk || $col->notnull) && !$col->pk ? ' NOT NULL' : '';
            $def = $col->dflt_value !== null ? ' DEFAULT ' . $col->dflt_value : ($col->notnull && !$col->pk && $col->name !== 'id' ? ' DEFAULT 0' : '');
            $cols[] = '"' . $col->name . '" ' . $type . $null . $def;
        }

        $tmp = 'ad_accounts_tmp';
        DB::statement("CREATE TABLE \"$tmp\" (" . implode(', ', $cols) . ')');
        $all = implode(', ', array_map(fn($c) => '"' . $c->name . '"', $info));
        DB::statement("INSERT INTO \"$tmp\" ($all) SELECT $all FROM ad_accounts");
        DB::statement('DROP TABLE ad_accounts');
        DB::statement("ALTER TABLE \"$tmp\" RENAME TO ad_accounts");
    }

    public function down(): void {}
};
