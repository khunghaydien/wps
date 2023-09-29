@echo off
rem -----------------------------
rem compass の環境を構築する時に実行するコマンド（最初の1回しか行わない）
rem compass create --sass-dir "sass" --css-dir "css" --javascripts-dir "js" --images-dir "img"
rem -----------------------------
rem 環境設定は config.rb を見ること

rem 監視コマンドの実行
rem （終了する時は Ctrl-C）
@echo on
compass watch
