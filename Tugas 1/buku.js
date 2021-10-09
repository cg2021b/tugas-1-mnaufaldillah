function main(){
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    var vertices_kiri = [
        -0.9, -0.1, 1.0, 0.0, 0.0,      //titik A
        -0.2, -0.1, 1.0, 0.0, 0.0,      //titik B
        -0.2, 0.1, 1.0, 0.0, 0.0,       //titik C
        -0.9, 0.1, 1.0, 0.0, 0.0,      //titik D
        -0.8, 0.3, 1.0, 0.0, 0.0,      //titik E
        -0.3, 0.3, 1.0, 0.0, 0.0,      //titik F
        -0.2, 0.1, 1.0, 0.0, 0.0,       //titik C
        -0.9, 0.1, 1.0, 0.0, 0.0,      //titik D
    ];

    var vertices_kanan = [
        0.2, 0.4, 1.0, 0.0, 0.0,      //titik A
        0.7, 0.4, 1.0, 0.0, 0.0,      //titik B
        0.7, -0.6, 1.0, 0.0, 0.0,       //titik C
        0.2, -0.6, 1.0, 0.0, 0.0,      //titik D
    ];

    var vertices = [...vertices_kiri, ...vertices_kanan];

    //linked list untuk menyimpan data vertex
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vertexShaderSource = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying  vec3 vColor;
        uniform mat4 uTranslate;
        void main(){
            gl_Position = uTranslate * vec4(aPosition, 0.0, 1.0);
            vColor = aColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;
        void main(){
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentShaderSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 2*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    var speedRaw = 202;
    var speed = speedRaw/10000;
    var change = 0;
    var uTranslate = gl.getUniformLocation(shaderProgram, "uTranslate");
    function render() {
        if(change >= 0.5 || change <=-0.5) speed = -speed;
        change += speed;

        var kiri = [
            1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0, 0.0, 0.0, 1.0,
        ]

        var kanan = [
            1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0, change, 0.0, 1.0,
        ]

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniformMatrix4fv(uTranslate, false, kiri);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices_kiri.length/5);

        gl.uniformMatrix4fv(uTranslate, false, kanan);
        gl.drawArrays(gl.TRIANGLE_FAN, vertices_kiri.length/5, vertices_kanan.length/5);
        requestAnimationFrame(render);
    }
    render();
    
}