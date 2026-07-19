# LeadBox Release Gate

Release bị chặn khi bất kỳ rule Critical hoặc High có trạng thái FAIL/BLOCKED.

Luồng chuẩn:
1. Playwright tạo kết quả.
2. Analyzer gom kết quả thành `reports/qa-summary.json`.
3. `npm run qa:gate` sinh `reports/release-gate.json`.
4. GitHub Actions dừng pipeline nếu gate bị BLOCKED.

Trong scaffold độc lập, các rule cần bản LeadBox thật sẽ ở trạng thái BLOCKED thay vì giả định PASS.
